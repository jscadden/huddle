class TreesController < ApplicationController
  before_filter :require_user
  
  def index
    @trees = current_user.trees.all
  end
  
  def show
    @tree = Tree.find(params[:id])
    set_current_tree(@tree)
  end
  
  def new
    @tree = current_user.trees.new
  end
  
  def create
    @tree = current_user.trees.new(params[:tree])
    
    if @tree.save
      flash[:notice] = "Successfully created tree."
      redirect_to @tree
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
end
