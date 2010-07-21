class AddVerifiedAtToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :verified_at, :datetime
    User.update_all(["verified_at = ?", Time.now])
  end

  def self.down
    remove_column :users, :verified_at
  end
end
