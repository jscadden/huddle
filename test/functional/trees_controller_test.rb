require 'test_helper'

class TreesControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end
  
  def test_show
    get :show, :id => Tree.first
    assert_template 'show'
  end
  
  def test_new
    get :new
    assert_template 'new'
  end
  
  def test_create_invalid
    Tree.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end
  
  def test_create_valid
    Tree.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to tree_url(assigns(:tree))
  end
  
  def test_edit
    get :edit, :id => Tree.first
    assert_template 'edit'
  end
  
  def test_update_invalid
    Tree.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Tree.first
    assert_template 'edit'
  end
  
  def test_update_valid
    Tree.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Tree.first
    assert_redirected_to tree_url(assigns(:tree))
  end
  
  def test_destroy
    tree = Tree.first
    delete :destroy, :id => tree
    assert_redirected_to trees_url
    assert !Tree.exists?(tree.id)
  end
end
