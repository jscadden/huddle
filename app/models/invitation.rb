class Invitation < ActiveRecord::Base
  belongs_to :sender, :class_name => "User"
  belongs_to :recipient, :class_name => "User"
  belongs_to :tree

  validates_uniqueness_of :token
  validates_uniqueness_of :recipient_email, :scope => :tree_id, 
                          :message => "has already been invited"
  validates_presence_of :sender_id, :tree_id
  validate :sender_must_own_tree, :sender_must_not_be_recipient

  delegate :name, :email, :to => :sender, :prefix => true
  delegate :name, :to => :recipient, :prefix => true
  delegate :title, :to => :tree, :prefix => true

  named_scope :unaccepted, :conditions => "invitations.recipient_id IS NULL"
  named_scope :accepted, :conditions => "invitations.recipient_id IS NOT NULL"
  named_scope :read_only, :condition => ["invitations.read_only = ?", true]
  named_scope :read_write, :condition => ["invitations.read_only = ?", false]

  default_scope :order => "invitations.recipient_id DESC, invitations.recipient_email"

  attr_accessor :url
  attr_accessible :recipient_email, :tree_id, :read_only

  def initialize(*args)
    super(*args)
    generate_token
  end

  def recipient_name_or_email
    recipient ? recipient.name : recipient_email
  end

  def to_param
    self.token
  end

  def status
    if !recipient_id.blank?
      "Accepted"
    else
      "Pending"
    end
  end


  private

  def generate_token
    self.token = Authlogic::Random::friendly_token
  end

  def sender_must_own_tree
    unless tree && tree.user == sender
      errors.add(:tree, "does not belong to you")
    end
  end

  def sender_must_not_be_recipient
    if self.sender == self.recipient
      errors.add(:recipient, "may not be the same as the sender")
    end
  end

end
