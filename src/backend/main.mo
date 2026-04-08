import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Tutorial = {
    id : Nat;
    title : Text;
    slug : Text;
    category : Text;
    difficulty : Text;
    description : Text;
    content : Text;
    codeExample : Text;
    estimatedMinutes : Nat;
    tags : [Text];
    featured : Bool;
  };

  module Tutorial {
    public func compare(t1 : Tutorial, t2 : Tutorial) : Order.Order {
      Nat.compare(t1.id, t2.id);
    };
  };

  type TutorialSummary = {
    id : Nat;
    title : Text;
    slug : Text;
    category : Text;
    difficulty : Text;
    description : Text;
    estimatedMinutes : Nat;
    featured : Bool;
  };

  module TutorialSummary {
    public func compare(s1 : TutorialSummary, s2 : TutorialSummary) : Order.Order {
      Text.compare(s1.title, s2.title);
    };
  };

  type UserProgress = {
    tutorialId : Nat;
    completedAt : Time.Time;
  };

  module UserProgress {
    public func compare(up1 : UserProgress, up2 : UserProgress) : Order.Order {
      Nat.compare(up1.tutorialId, up2.tutorialId);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let tutorials = Map.empty<Nat, Tutorial>();
  let slugToIdMap = Map.empty<Text, Nat>();
  let userProgress = Map.empty<Principal, Map.Map<Nat, Time.Time>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let categories = ["Basics", "Data Structures", "Actors & Async", "Patterns", "Security", "Interoperability", "Advanced"];
  let difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func initializeTutorials() {
    let tutorialList : [(Nat, Tutorial)] = [
      (
        1,
        {
          id = 1;
          title = "Motoko Syntax Basics";
          slug = "motoko-syntax-basics";
          category = "Basics";
          difficulty = "Beginner";
          description = "Learn the fundamental syntax of Motoko.";
          content = "# Motoko Syntax Basics\nLearn the fundamental syntax of Motoko...";
          codeExample = "let x = 5 : Nat;";
          estimatedMinutes = 15;
          tags = ["syntax", "beginner"];
          featured = true;
        },
      ),
      (
        2,
        {
          id = 2;
          title = "Working with Arrays";
          slug = "working-with-arrays";
          category = "Data Structures";
          difficulty = "Beginner";
          description = "Introduction to arrays in Motoko.";
          content = "# Arrays\nArrays are a fundamental data structure in Motoko...";
          codeExample = "let myArray = [1, 2, 3];";
          estimatedMinutes = 20;
          tags = ["arrays", "data structures"];
          featured = false;
        },
      ),
      (
        3,
        {
          id = 3;
          title = "Actors and Messages";
          slug = "actors-and-messages";
          category = "Actors & Async";
          difficulty = "Intermediate";
          description = "Learn how to work with actors and messages.";
          content = "# Actors\nActors are the primary abstraction in Motoko for asynchronous computation...";
          codeExample = "actor MyActor { public func greet() : async Text { \"Hello\" } };";
          estimatedMinutes = 30;
          tags = ["actors", "async", "messages"];
          featured = true;
        },
      ),
      (
        4,
        {
          id = 4;
          title = "Pattern Matching";
          slug = "pattern-matching";
          category = "Patterns";
          difficulty = "Intermediate";
          description = "Explore pattern matching techniques.";
          content = "# Pattern Matching\nPattern matching allows you to destructure and match values...";
          codeExample = "switch (x) { case (0) { ... } }";
          estimatedMinutes = 25;
          tags = ["patterns", "switch"];
          featured = false;
        },
      ),
      (
        5,
        {
          id = 5;
          title = "Security Best Practices";
          slug = "security-best-practices";
          category = "Security";
          difficulty = "Advanced";
          description = "Learn about security in Motoko.";
          content = "# Security Best Practices\nSecurity is crucial in smart contract development...";
          codeExample = "ignore caller;";
          estimatedMinutes = 40;
          tags = ["security", "best practices"];
          featured = true;
        },
      ),
      (
        6,
        {
          id = 6;
          title = "Candid Interoperability";
          slug = "candid-interoperability";
          category = "Interoperability";
          difficulty = "Advanced";
          description = "Work with Candid interface files.";
          content = "# Candid Interoperability\nCandid is an interface definition language for the Internet Computer...";
          codeExample = "type Person = { name : Text };";
          estimatedMinutes = 35;
          tags = ["candid", "interop"];
          featured = false;
        },
      ),
      (
        7,
        {
          id = 7;
          title = "Using Maps";
          slug = "using-maps";
          category = "Data Structures";
          difficulty = "Beginner";
          description = "Introduction to maps in Motoko.";
          content = "# Maps\nMaps are key-value data structures in Motoko...";
          codeExample = "let myMap = Map.empty<Text, Nat>();";
          estimatedMinutes = 20;
          tags = ["maps", "data structures"];
          featured = true;
        },
      ),
      (
        8,
        {
          id = 8;
          title = "Loops and Iterators";
          slug = "loops-and-iterators";
          category = "Patterns";
          difficulty = "Intermediate";
          description = "Working with loops and iterators in Motoko.";
          content = "# Loops and Iterators\nMotoko provides several looping constructs and iterators...";
          codeExample = "for (x in array.repeat(0, 5)) { ... };";
          estimatedMinutes = 25;
          tags = ["loops", "iterators"];
          featured = false;
        },
      ),
      (
        9,
        {
          id = 9;
          title = "Concurrency in Motoko";
          slug = "concurrency-in-motoko";
          category = "Actors & Async";
          difficulty = "Advanced";
          description = "Learn about concurrent programming.";
          content = "# Concurrency\nMotoko supports concurrent programming through actors and messages...";
          codeExample = "actor MyActor { public func compute() : async Nat { 42 } };";
          estimatedMinutes = 40;
          tags = ["concurrency", "actors"];
          featured = true;
        },
      ),
      (
        10,
        {
          id = 10;
          title = "Text Manipulation";
          slug = "text-manipulation";
          category = "Basics";
          difficulty = "Beginner";
          description = "Learn how to work with text in Motoko.";
          content = "# Text Manipulation\nText is the string type in Motoko...";
          codeExample = "let greeting = \"Hello, World!\";";
          estimatedMinutes = 15;
          tags = ["text", "strings"];
          featured = false;
        },
      ),
    ];

    for ((id, tutorial) in tutorialList.values()) {
      tutorials.add(id, tutorial);
      slugToIdMap.add(tutorial.slug, id);
    };
  };

  initializeTutorials();

  func getTutorialBySlugInternal(slug : Text) : Tutorial {
    let id = switch (slugToIdMap.get(slug)) {
      case (null) { Runtime.trap("Tutorial not found") };
      case (?id) { id };
    };
    switch (tutorials.get(id)) {
      case (null) { Runtime.trap("Tutorial not found") };
      case (?tutorial) { tutorial };
    };
  };

  func tutorialToSummary(tutorial : Tutorial) : TutorialSummary {
    {
      id = tutorial.id;
      title = tutorial.title;
      slug = tutorial.slug;
      category = tutorial.category;
      difficulty = tutorial.difficulty;
      description = tutorial.description;
      estimatedMinutes = tutorial.estimatedMinutes;
      featured = tutorial.featured;
    };
  };

  // Public read-only functions - no authorization needed (guests allowed)
  public query ({ caller }) func getTutorials(category : ?Text, difficulty : ?Text, search : ?Text) : async [TutorialSummary] {
    tutorials.values().toArray().filter(
      func(tutorial) {
        let categoryMatch = switch (category) {
          case (null) { true };
          case (?cat) { tutorial.category == cat };
        };
        let difficultyMatch = switch (difficulty) {
          case (null) { true };
          case (?diff) { tutorial.difficulty == diff };
        };
        let searchMatch = switch (search) {
          case (null) { true };
          case (?term) {
            tutorial.title.contains(#text term) or
            tutorial.description.contains(#text term) or
            tutorial.tags.foldLeft(
              false,
              func(acc, tag) {
                acc or tag.contains(#text term);
              },
            );
          };
        };
        categoryMatch and difficultyMatch and searchMatch;
      }
    ).map(
      tutorialToSummary
    ).sort();
  };

  public query ({ caller }) func getFeaturedTutorials() : async [TutorialSummary] {
    tutorials.values().toArray().filter(
      func(tutorial) { tutorial.featured }
    ).map(
      tutorialToSummary
    ).sort().sliceToArray(0, 6);
  };

  public query ({ caller }) func getTutorial(slug : Text) : async Tutorial {
    getTutorialBySlugInternal(slug);
  };

  public query ({ caller }) func getCategories() : async [(Text, Nat)] {
    categories.map(
      func(category) {
        var count = 0;
        for (tutorial in tutorials.values()) {
          if (tutorial.category == category) { count += 1 };
        };
        (category, count);
      }
    );
  };

  public query ({ caller }) func getStats() : async {
    totalTutorials : Nat;
    totalCompletions : Nat;
    totalUsers : Nat;
  } {
    var totalCompletions = 0;
    for (progress in userProgress.values()) {
      totalCompletions += progress.size();
    };
    {
      totalTutorials = tutorials.size();
      totalCompletions;
      totalUsers = userProgress.size();
    };
  };

  // User-specific functions - require authenticated user (#user role)
  public shared ({ caller }) func markComplete(tutorialId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark tutorials complete");
    };
    let now = Time.now();
    let progress = switch (userProgress.get(caller)) {
      case (null) {
        let newProgress = Map.empty<Nat, Time.Time>();
        userProgress.add(caller, newProgress);
        newProgress;
      };
      case (?prog) { prog };
    };
    progress.add(tutorialId, now);
  };

  public shared ({ caller }) func markIncomplete(tutorialId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark tutorials incomplete");
    };
    switch (userProgress.get(caller)) {
      case (null) { () };
      case (?progress) { progress.remove(tutorialId) };
    };
  };

  public query ({ caller }) func getUserProgress() : async [UserProgress] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their progress");
    };
    switch (userProgress.get(caller)) {
      case (null) { [] };
      case (?progress) {
        progress.entries().toArray().map(
          func((tutorialId, completedAt)) {
            {
              tutorialId;
              completedAt;
            };
          }
        ).sort();
      };
    };
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
