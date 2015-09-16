# role, feature, benefit
# written in gherkin syntax

Feature: Session Voting
As a BarCamp attendee
I want to be able to vote for proposed sessions
In order to help my favorite sessions get presented


	Scenario: Log in to vote for sessions
	  Given I have received a registration code
	  And I have a device such as a phone or laptop
	  When I navigate to the Voting App on my device
	  Then I should see a view with an input box, some helper text 
	    that asks for my code, and a submit button. 


	Scenario: Display landing page
	  Given I have received a registration code
	  When I log in to the Voting App
	  Then I should be an authenticated user
	  And I should see a landing page that says, "Welcome to BarCamp Nashville 2015"

	Scenario: Views
	  Given I am an authenticated user of the Voting App
	  When I look at the first screen
	  Then I should see a landing page that says, "Welcome to BarCamp Nashville 2015"
	  And I should see a hamburger menu at top-right
	  And the menu should have four items in the nav
	  And the items should be "BarCamp Nashville 2015", "Morning Voting", "Afternoon Voting", "Favorites from Website"

	Scenario: Instructions
	  Given I am an authenticated user of the Voting App
	  When the "Welcome to BarCamp" landing page displays
	  Then there should be instructions there on how to vote, voting timeframe for morning and afternoon, and when the schedules should be ready
	  And I will be instructed to click the hamberget menu at top-right to begin
	  	 
	Scenario: Number of votes should update
	  Given I am an authenticated user of the Voting App
	  When navigate to a voting view
	  Then I see that I can vote for four sessions
	  And I can vote for a session, which should mark it as selected
	  And I should see that I only have three votes left
	  And I can revoke my previous vote 
	  And I should see that I have four votes left

	Scenario: Check favorites
	  # For this scenario, I think we need to authenticate the user to the BCN website in order to get the favorites. Otherwise this won't work. I'm not sure of another way to do this.   
	  Given I have been choosing my Favorites at the Website
	  And I am an authenicated user on the Voting App
	  When I am on the view for sessions that I can vote for on the Voting App
	  And I choose "My Favorites from Website"
	  Then I should see a modal to authenticate my BCN credentials
	  And I should then be able to toggle to a view of Favorites from the Website
	  And I should be able to toggle back to the Voting App via the same button
	  And the Voting App view should persist from its previous state
	
	Scenario: Signout warning
	  Given I have chosen four sessions on the Voting App
	  And I feel good about my votes
	  When I click to sign out
	  Then I should receive an alert, warning that I won't be able to change my votes
	  And I should be able to confirm signout with the click of a button

	Scenario: Placeholder view
	  Given the afternoon voting session is disabled in the morning
	  When I log in and authenicate
	  And I navigate to the afternoon voting session
	  Then I should see an "Under Construction" view 
	  And this should act as a placeholder

	Scenario: Results
	  Given the time to vote for sessions is over
	  And BCN updates the Voting App with the final tally
	  When the update is deployed
	  Then the view of the Voting App on my phone or device should refresh
	  And I should see which sessions received the most votes
	  And the default view should be from highest scoring session to lowest
	  
	Scenario: Security
	  
	  #I don't know enough about how the toggle to enable/disable voting is a security risk to write a feature on this. But it seems to me it should be done
	  

	Scenario: View schedule
	  Given that BCN has updated the final tally after morning voting ends
	  When I navigate to the morning voting tab
	  Then I should see the morning schedule
	  
