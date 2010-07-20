authorization do

  role :guest do
    has_permission_on :trees, :to => [:view,] do
      if_attribute :public => is {true}
    end

    has_permission_on :nodes, :to => [:view,] do
      if_permitted_to :view, :tree
    end
  end

  role :user do
    includes :guest

    has_permission_on :trees, :to => :manage do
      if_attribute :user => is {user}
    end

    has_permission_on :trees, :to => :collaborate do
      if_attribute :rw_invitations => intersects_with {user.invitations_received}
    end

    has_permission_on :nodes, :to => :manage do
      if_permitted_to :manage, :tree
      if_permitted_to :collaborate, :tree
    end

    has_permission_on :trees, :to => :view do
      if_attribute :ro_invitations => intersects_with {user.invitations_received}
    end

  end

end
    
privileges do

  privilege :view do
    includes :read, :show, :index
  end

  privilege :collaborate do
    includes :view, :update
  end

  privilege :manage do
    includes :collaborate, :create, :delete, :destroy, :edit, :new
  end

end
