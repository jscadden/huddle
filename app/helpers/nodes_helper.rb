module NodesHelper

  def div_for_node(node, &block)
    classes = node.viewed_by?(current_user) ? "viewed" : ""
    div_for(node, :class => classes, &block)
  end

  def reply_to_node_link(node)
    link_to(image_tag("arrow_reply.png", :title => "Reply"), 
            new_node_path(:parent => node.id), :class => "reply")
  end

end
