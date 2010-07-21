class Notifier < ActionMailer::Base
  
  def invitation(recipient_email, url, sender_email, tree_title)
    recipients recipient_email
    subject "Invitation to collaborate on my Huddle"
    from "noreply@realtimehuddle.com"
    body :url => url, :sender_email => sender_email, :tree_title => tree_title
    sent_on Time.now
  end

  def user_email_verification(user)
    recipients user.email
    subject "Please verify your account at realtimehuddle.com"
    from "noreply@realtimehuddle.com"
    body :user => user
    sent_on Time.now
  end
end
