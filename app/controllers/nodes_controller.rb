class NodesController < ApplicationController
  filter_resource_access

  def index
    @nodes = Node.all
  end
  
  def show
    @node = Node.find(params[:id])
    @node.viewed_by(current_user)
    respond_to do |format|
      format.html {
        render :json => @node.to_hash(current_user).to_json
      }
      format.js { }
      format.json {
        render :json => @node.to_hash(current_user).to_json
      }
    end
  end
  
  def new
    @parent_id  = params[:parent]
  end
  
  def create
    @node.user = current_user
    if @node.save
      flash.now[:notice] = "Successfully created node."
      node_json = @node.to_hash(current_user).to_json
      Orbited.send_data('huddle', node_json)
      render :text => @node.id
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


  protected

  def new_node_from_params
    @node = current_user.nodes.build(params[:node])
  end
end
