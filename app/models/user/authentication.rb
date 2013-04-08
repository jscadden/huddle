class User
  module Authentication

    def self.included(base)
      base.class_eval do
        acts_as_authentic do
          validate_login_field(true)
          validate_email_field(true)
          validate_password_field(true)
        end
      end
    end

  end
end
