# role, feature, benefit

Feature: Website Integration
As a BarCamp attendee
I want to be able to see sessions I favorited from the Website
In order to remember sessions that sounded interesting


    Scenario: Log in to Drupal site
	Given I am a registered user on the BarCamp Website
      	And I have been choosing my Favorites from proposed sessions
        And I am an authenticated user on the Voting App
	When I navigate to "My Favorites from Website" from the Voting App
	Then I should see a view that lets me log in with my BCN credentials
	
    Scenario: Check favorites
	Given I have been choosing my Favorites at the Website
	And I am an authenticated user on the Voting App
	When I am on any view on the Voting App
	And I navigate to "My Favorites from Website"
	And I enter my BCN credentials on the subsequent login view
      	Then a view of Favorites from the Website should display
	And I should be able navigate back to any other page in the Voting App
	And the Voting App view should persist from its previous state
	
