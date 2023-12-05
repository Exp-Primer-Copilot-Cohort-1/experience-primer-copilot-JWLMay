function skillsMember() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/components/members/skills.html',
    controller: 'SkillsController as skillsCtrl'
  };
}