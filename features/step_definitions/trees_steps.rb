Then /^I should see my new tree\'s root node$/ do
  # FIXME: this is rough since the nodes are loaded via ajax for some reason
  page.should have_css("#nodes_wrapper")
  page.should have_css("#nodes")
end

Then /^I should see the tree\'s title$/ do
  within("#tree_nodes .node .title") do
    page.should have_content(newest_tree.title)
  end
end

Then /^I should see the public tree\'s title$/ do
  tree = Tree.is_public.find(:first, :order => "created_at DESC")
  within("#tree_nodes .node .title") do
    page.should have_content(tree.title)
  end
end

Then /^I should not see a link to the invited tree$/ do
  page.should_not have_css("a[href='#{tree_path(newest_invitation.tree)}']")
end

When /^I mark the tree as public$/ do
  visit(edit_tree_path(newest_tree))
  check("Public")
  click_button("Save Huddle")
end

When /^I mark the tree as private$/ do
  visit(edit_tree_path(newest_tree))
  uncheck("Public")
  click_button("Save Huddle")
end

Then /^I should see an indicator that the tree is public$/ do
  within("#tree_info") do
    page.should have_content("This huddle is public")
  end
end

Then /^I should not see an indicator that the tree is public$/ do
  within("#tree_info") do
    page.should_not have_content("This huddle is public")
  end
end

When /^I visit the public tree$/ do
  tree = Tree.is_public.find(:first, :order => "created_at DESC")
  visit(tree_path(tree))
end

Then /^I should not see a reply link$/ do
  page.should_not have_css("a[href^='#{new_node_path}']")
end
