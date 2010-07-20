class Notifier < ActionMailer::Base
  
  def invitation(recipient_email, url, sender_email, tree_title)
    recipients recipient_email
    subject "Invitation to collaborate on my Huddle"
    from "noreply@realtimehuddle.com"
    body :url => url, :sender_email => sender_email, :tree_title => tree_title
    sent_on Time.now
  end

end
