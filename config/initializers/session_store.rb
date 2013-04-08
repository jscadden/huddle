# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_huddle_session',
  :secret      => 'cbc8c539ee106e286bf9e6613d45e6a3c2c53a74d8006ed12c91ef8d0ac147da263f1be473b39f6c8b1ae22450f3eb7243cb3c8c2d4cdc7295b87a3b617cadf1'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
