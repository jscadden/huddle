class CreateInvitations < ActiveRecord::Migration
  def self.up
    create_table :invitations do |t|
      t.references :sender
      t.string :recipient_email
      t.references :recipient
      t.string :token
      t.references :tree
      t.boolean :read_only, :null => false, :default => false

      t.timestamps
    end
  end

  def self.down
    drop_table :invitations
  end
end
