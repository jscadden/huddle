module NodesHelper

  def div_for_node(node, &block)
    classes = node.viewed_by?(current_user) ? "viewed" : ""
    div_for(node, :class => classes, &block)
  end

end
