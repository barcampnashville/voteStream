'use strict';

const HeroListController = function($scope, $element, $attrs, Polling) {

  this.checked = null;
  this.polling = null;

  // TODO remove after testing
  this.polling = { open: true, sessions: 'morning' };
  this.maxVotes = 4;

  // When the component initializes, set it's checked value to true / false depending on if it's index value is in the voteArray or not
  this.$onInit = function() {
    //   Polling.getPollingPeriods()
    //   .then(res => { this.polling = res; });

    //   console.log('Polling', Polling.getPollingPeriods());
    // this.checked = this.hasVote({ index: this.index });
  }

   // Can use this when resetting the votearray. This will return a changes.vote array with the new value from the controller. Then I can recheck which checkboxes are checked
   this.$onChanges = function(changes) {
       // Any time there is a change made to $scope.voteArray from the parent controller, this function will fire.
       // Using this on init and reset to set each checkbox checked value.
       if (changes.votes) {
           this.checked = this.arrayHasVote({ index: this.index });
       }
   };

   this.isDisabled = function() {
       if (this.votes.length === this.maxVotes && !this.arrayHasVote({ index: this.index })) {
            return true;
        } else if (this.hasVoted) {
            return true;
        } else {
            return false;
        }
    };

    this.shouldShow = function() {
        return (this.polling.open && this.polling.sessions === this.sessionType);
    };

    this.isChecked = function() {
        // If a checkbox has been checked and is not in the voteArray, add the index to the array
        if (this.checked && !this.arrayHasVote({ index: this.index })) {
            this.addVote({ index: this.index });
        // If a checkbox has been unchecked and is in the voteArray, remove the index to the array
        } else if (!this.checked && this.arrayHasVote({ index: this.index })) {
            this.removeVote({ index: this.index });
        }
        // Calculate remaining votes
        this.getRemainingVotes();
    };
};

app.component('checkbox', {
    templateUrl: './templates/checkbox.html',

    controller: HeroListController,

    bindings: {
        session: '<',
        sessionType: '<',
        index: '<',
        votes: '<',
        hasVoted: '<',
        addVote: '&',
        removeVote: '&',
        arrayHasVote: '&',
        getRemainingVotes: '&',
    }
});
