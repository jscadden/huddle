module TreesHelper
  def setup_tree(tree)
    returning(tree) do |t|
      t.build_node unless t.node
    end
  end
end
