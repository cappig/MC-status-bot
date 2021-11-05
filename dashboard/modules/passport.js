const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const User = require("../../database/userSchema")

// Passport config
passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: 'http://localhost:3000/auth',
        scope: ['identify', 'guilds'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const {id, username, avatar, discriminator, guilds} = profile
        try {
          const validGuilds = guilds.filter((guild) => (guild.permissions & 0x20) === 0x20)

          const cGuilds = [];
          validGuilds.forEach(guild => {
            const guilddata = client.guilds.cache.get(guild.id);
            if (guilddata) guild.mutual = true;
            else guild.mutual = false;
          });
          
          // Sort the guilds so that the mutual ones are at the begging
          validGuilds.sort(function(x,y) { return x.mutual == true ? -1 : y.mutual == true ? 1 : 0; });
          
          const user = await User.findOneAndUpdate({_id: id}, {
            tag: `${username}#${discriminator}`,
            avatar,
            guilds: validGuilds
          },{
            useFindAndModify: false,
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          })
  
          return done (null, user)
        } catch (err) {
          console.error(err)
          return done (err, null)
        }

      }
    )
);

passport.serializeUser((user, done) =>{
    done(null, user);
});
passport.deserializeUser(async (user, done) => {
    try {
        const finduser = await User.findById({_id: user._id});
        return finduser ? done (null, finduser) : done (null, null);
    } catch (err) {
        done (err, null);
    }
});