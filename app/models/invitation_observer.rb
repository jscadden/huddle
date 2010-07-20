class InvitationObserver < ActiveRecord::Observer
  
  def after_create(invitation)
    Notifier.deliver_invitation(invitation.recipient_email,
                                invitation.url,
                                invitation.sender_email,
                                invitation.tree_title)
  end

end
