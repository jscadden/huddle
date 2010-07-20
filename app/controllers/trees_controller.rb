class TreesController < ApplicationController
  layout "trees", :except => [:index] 
  before_filter :require_user, :except => [:show,]
  filter_resource_access

  def index
    @trees = current_user.trees.all
    @invited_trees = current_user.invited_trees
  end
  
  def show
    @tree = Tree.find(params[:id])
    set_current_tree(@tree)
  end
  
  # See note for +#create+ to explain why we're building a node here.
  def new
  end
  
  # In a slightly different method, I've decided to have the trees controller
  # create trees in a backwards way.  That is, in order to create a new tree,
  # we create its root node with a flag that tells the node to create its tree
  # after it creates itself.  This helps prevent the chicken and egg problem
  # that springs from having the tree validate the presence of its root node
  # while it doesn't exist.  To my understanding, even using
  # +accepts_nested_attributes_for+ will cause the tree to be saved before the
  # node, causing a validation failure.
  def create
    @node.is_root = true

    if @node.save
      flash[:notice] = "Successfully created tree."
      redirect_to @node.tree
    else
      render :action => 'new'
    end
  end
  
  def edit
    @tree = Tree.find(params[:id])
  end
  
  def update
    @tree = Tree.find(params[:id])
    if @tree.update_attributes(params[:tree])
      flash[:notice] = "Successfully updated tree."
      redirect_to @tree
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @tree = Tree.find(params[:id])
    @tree.destroy
    flash[:notice] = "Successfully destroyed tree."
    redirect_to trees_url
  end


  protected

  def new_tree_from_params
    @node = current_user.nodes.build(params[:node])
    @tree = @node.build_tree
    @tree.user = current_user
  end

end
