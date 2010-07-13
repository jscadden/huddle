require "spec_helper"

describe Node do

  subject {Factory.build("node")}

  it "must have a title" do
    subject.title = nil

    subject.should_not be_valid
    subject.errors.on(:title).should_not be_empty
  end

  describe "#save" do
    context "a new root" do

      before(:each) do
        subject.is_root = true
      end

      it "should raise an exception if its tree is not saved" do
        tree = Factory.build("tree")
        subject.stub(:build_tree).and_return(tree)
        tree.should_receive(:save!).and_raise(ActiveRecord::ActiveRecordError)

        lambda {subject.save!}.should raise_error(ActiveRecord::ActiveRecordError)
        subject.should be_new_record
      end

      it "should create its own tree" do
        tree = Factory.build("tree")
        subject.stub(:build_tree).and_return(tree)
        tree.should_receive(:save!).and_return(nil)

        lambda {subject.save!}.should change(Tree, :count).by(1)
        subject.tree.should_not be_nil
      end
    end

    context ("to an existing tree") do
      
      before(:each) do
        subject.is_root = false
      end

      it "should not create its own tree" do
        lambda {subject.save!}.should_not change(Tree, :count)
        subject.tree.should be_nil
      end

    end
  end

end
