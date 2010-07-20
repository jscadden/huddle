class Tree < ActiveRecord::Base
  belongs_to :user
  belongs_to :node, :dependent => :destroy
  has_many :invitations, :dependent => :destroy

  with_options(:class_name => "Invitation") do |i|
    i.has_many :ro_invitations, :conditions => {:read_only => true}
    i.has_many :rw_invitations, :conditions => {:read_only => false}
  end

  validates_presence_of :node_id
  validates_presence_of :user_id

  delegate :title, :to => :node

  accepts_nested_attributes_for :invitations, :allow_destroy => true

  # can't use public as it's a reserved word somewhere?
  # https://rails.lighthouseapp.com/projects/8994/tickets/404-named_scope-bashes-critical-methods
  named_scope :is_public, :conditions => {:public => true}
  named_scope :is_private, :conditions => {:public => false}
end
