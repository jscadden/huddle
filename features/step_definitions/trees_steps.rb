Then /^I should see my new tree\'s root node$/ do
  # FIXME: this is rough since the nodes are loaded via ajax for some reason
  page.should have_css("#nodes_wrapper")
  page.should have_css("#nodes")
end
