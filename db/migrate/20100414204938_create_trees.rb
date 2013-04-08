class CreateTrees < ActiveRecord::Migration
  def self.up
    create_table :trees do |t|
      t.references :user
      t.references :node
      t.timestamps
    end
  end
  
  def self.down
    drop_table :trees
  end
end
