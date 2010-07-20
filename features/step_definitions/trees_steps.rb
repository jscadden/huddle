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

Then /^I should not see a link to the invited tree$/ do
  page.should_not have_css("a[href='#{tree_path(newest_invitation.tree)}']")
end

