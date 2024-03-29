# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100721211127) do

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "node_id"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "invitations", :force => true do |t|
    t.integer  "sender_id"
    t.string   "recipient_email"
    t.integer  "recipient_id"
    t.string   "token"
    t.integer  "tree_id"
    t.boolean  "read_only",       :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "nodes", :force => true do |t|
    t.integer  "user_id"
    t.string   "title"
    t.string   "description"
    t.string   "ancestry"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "nodes", ["ancestry"], :name => "index_nodes_on_ancestry"

  create_table "trees", :force => true do |t|
    t.integer  "user_id"
    t.integer  "node_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "public",     :default => false, :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "login",                                   :null => false
    t.string   "email",                                   :null => false
    t.string   "crypted_password",                        :null => false
    t.string   "password_salt",                           :null => false
    t.string   "persistence_token",                       :null => false
    t.string   "single_access_token",                     :null => false
    t.string   "perishable_token",                        :null => false
    t.integer  "login_count",         :default => 0,      :null => false
    t.integer  "failed_login_count",  :default => 0,      :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "role",                :default => "user", :null => false
    t.datetime "verified_at"
  end

  create_table "viewers", :force => true do |t|
    t.integer  "user_id"
    t.integer  "node_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
