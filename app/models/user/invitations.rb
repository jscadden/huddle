class User
  module Invitations

    def self.included(base)
      base.class_eval do
        with_options(:class_name => "Invitation") do |i|
          i.has_many :invitations_sent, :foreign_key => "sender_id"
          i.has_many :invitations_received, :foreign_key => "recipient_id"
        end
      end
    end

    def name
      "#{login} (#{email})"
    end

  end
end
