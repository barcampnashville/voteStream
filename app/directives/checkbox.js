'use strice';

function HeroListController($scope, $element, $attrs) {

  this.checked = null;

  // When the component initializes, set it's checked value to true / false depending on if it's index value is in the voteArray or not
  this.$onInit = function() {
    this.checked = this.hasVote({ index: this.index });
  }

   // Can use this when resetting the votearray. This will return a changes.vote array with the new value from the controller. Then I can recheck which checkboxes are checked
   this.$onChanges = function(changes) {
    console.log("changes", changes);
    // this.votes = changes.votes;
   };

  this.isChecked = function() {
    // If a checkbox has been checked and is not in the voteArray, add the index to the array
    if (this.checked && !this.hasVote({ index: this.index })) {
      this.addVote({ index: this.index });
    // If a checkbox has been unchecked and is in the voteArray, remove the index to the array
    } else if (!this.checked && this.hasVote({ index: this.index })) {
      this.removeVote({ index: this.index });
    }
  };

}

app.component('checkbox', {
  templateUrl: './templates/checkbox.html',
  controller: HeroListController,
  bindings: {
    session: '<',
    index: '<',
    addVote: '&',
    removeVote: '&',
    hasVote: '&',
  }
});
