class User
  # I can't be named Authorization for some reason.  Something else must be
  # defining it?
  module UserAuthorization

    def role_symbols
      self.role.split.map(&:to_sym)
    end

    def self.included(base)
      base.class_eval do
        alias_method :roles, :role_symbols
      end
    end

  end
end
