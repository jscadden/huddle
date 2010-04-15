class NodesController < ApplicationController
  def index
    @nodes = Node.all
  end
  
  def show
    @node = Node.find(params[:id])
    respond_to do |format|
      format.html {
        render :json => @node.to_json(:include => {:user => {:only => :login}}, :methods => :comment_count)
      }
      format.js
      format.json {
        render :json => @node.to_json(:include => {:user => {:only => :login}}, :methods => :comment_count)
      }
    end
  end
  
  def new
    @parent_id  = params[:parent]
    @node = Node.new
  end
  
  def create
    #parent_id = params[:node]["parent_id"]
    @node = Node.new(params[:node])
    if @node.save
      flash[:notice] = "Successfully created node."
      redirect_to @node
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
