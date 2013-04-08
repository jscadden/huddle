require "spec_helper"

describe Tree do

  subject {Factory.build("tree")}

  it "must have a root node" do
    subject.node_id = nil

    subject.should_not be_valid
    subject.errors.on(:node_id).should_not be_empty
  end

  it "must have a user" do
    subject.user_id = nil

    subject.should_not be_valid
    subject.errors.on(:user_id).should_not be_empty
  end

end
