const passport = require('passport');
const Player = require("../../controllers/PlayerController");
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('../../controllers/PlayerController');

describe('GoogleStrategy', () => {
  let verifyCallback;
  let doneCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    doneCallback = jest.fn();

    passport.use.mockImplementation((strategy) => {
      verifyCallback = strategy._verify;
    });

    require('../../middleware/authGoogle');
  });

  it('should create a new user if one does not exist', async () => {
    const profile = {
      _json: {
        name: 'test',
        email: 'test@test.com',
      },
    };

    Player.selectPlayeByname.mockResolvedValue({ rows: [] });
    Player.insertPlayer.mockResolvedValue({});
    jwt.sign.mockReturnValue('token');

    await verifyCallback('accessToken', 'refreshToken', profile, doneCallback);

    expect(Player.selectPlayeByname).toHaveBeenCalledWith(profile._json.name);
    expect(Player.insertPlayer).toHaveBeenCalledWith(profile._json.email, profile._json.name, profile._json.password);
    expect(jwt.sign).toHaveBeenCalledWith({ name: profile._json.name, email: profile._json.email }, process.env.JWT_SECRET);
    expect(doneCallback).toHaveBeenCalledWith(null, 'token');
  });

  it('should handle errors', async () => {
    const error = new Error('Test error');

    Player.selectPlayeByname.mockRejectedValue(error);

    await verifyCallback('accessToken', 'refreshToken', {}, doneCallback);

    expect(doneCallback).toHaveBeenCalledWith(error);
  });
});
