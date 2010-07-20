class AddRoleToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :role, :string
    User.update_all("role='user'")
    change_column_default :users, :role, "user"
    change_column_null :users, :role, false
  end

  def self.down
    remove_column :users, :role
  end
end
