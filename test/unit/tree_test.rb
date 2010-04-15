require 'test_helper'

class TreeTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Tree.new.valid?
  end
end
