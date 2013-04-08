class AddPublicToTree < ActiveRecord::Migration
  def self.up
    add_column :trees, :public, :boolean
    Tree.update_all(["public = ?", false])
    change_column_default :trees, :public, false
    change_column_null :trees, :public, false
  end

  def self.down
    remove_column :trees, :public
  end
end
