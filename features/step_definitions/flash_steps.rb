Then /^I should see a flash notice matching "([^\"]*)"$/ do |message|
  within("#flash .notice") do
    page.should have_content(message)
  end
end

