class User < ActiveRecord::Base
  include User::Authentication
  include User::UserAuthorization
  include User::Invitations

  has_many :trees
  has_many :nodes

  with_options(:class_name => "Invitation") do |i|
    i.has_many :invitations_sent, :foreign_key => "sender_id"
    i.has_many :invitations_received, :foreign_key => "recipient_id"
  end

  has_many :invited_trees, 
           :through => :invitations_received, 
           :class_name => "Tree", 
           :source => :tree


  def verify!
    reset_perishable_token
    self.update_attributes!(:verified_at => Time.now)
  end

  def active?
    !verified_at.nil?
  end
  alias_method :verified?, :active?

  def send_verification_email
    if verified_at.nil?
      reset_perishable_token!
      Notifier.deliver_user_email_verification(self)
    end
  end

end
