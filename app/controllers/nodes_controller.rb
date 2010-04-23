class NodesController < ApplicationController
  def index
    @nodes = Node.all
  end
  
  def show
    @node = Node.find(params[:id])
    respond_to do |format|
      format.html {
        render :json => @node.to_json(:include => {:user => {:only => :login}}, :methods => [:comment_count, :parent_id])
      }
      format.js
      format.json {
        render :json => @node.to_json(:include => {:user => {:only => :login}}, :methods => [:comment_count, :parent_id])
      }
    end
  end
  
  def new
    @parent_id  = params[:parent]
    @node = Node.new
  end
  
  def create
    @node = Node.new(params[:node])
    @node.user = current_user
    if @node.save
      flash[:notice] = "Successfully created node."
      node_json = @node.to_json(:include => {:user => {:only => :login}}, :methods => [:comment_count, :parent_id])
      Orbited.send_data('huddle', node_json)
      render :js => "parent.$.fancybox.close();"
      #redirect_to tree_path(current_tree.id)
    else
      render :action => 'new'
    end
  end
  
  def edit
    @node = Node.find(params[:id])
  end
  
  def update
    @node = Node.find(params[:id])
    if @node.update_attributes(params[:node])
      flash[:notice] = "Successfully updated node."
      redirect_to @node
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @node = Node.find(params[:id])
    @node.destroy
    flash[:notice] = "Successfully destroyed node."
    redirect_to nodes_url
  end
end
