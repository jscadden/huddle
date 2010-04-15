class CreateNodes < ActiveRecord::Migration
  def self.up
    create_table :nodes do |t|
      t.references :user
      t.string :title
      t.string :description
      t.string :ancestry
      
      t.timestamps
    end
    add_index :nodes, :ancestry 
  end
  
  def self.down
    remove_index :nodes, :ancestry
    drop_table :nodes
  end
end
