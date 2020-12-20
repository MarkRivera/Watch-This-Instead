exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("movies")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("movies").insert([
        {
          tmdbId: 8487,
          title: "Wild Wild West",
          year: 1999,
          description:
            "Legless Southern inventor Dr. Arliss Loveless plans to rekindle the Civil War by assassinating President U.S. Grant. Only two men can stop him: gunfighter James West and master-of-disguise and inventor Artemus Gordon. The two must team up to thwart Loveless' plans.",
        },
        {
          tmdbId: 2362,
          title: "West World",
          year: 1973,
          description:
            "In a futuristic resort, wealthy patrons can visit recreations of different time periods and experience their wildest fantasies with life-like robots. But when Richard Benjamin opts for the wild west, he gets more than he bargained for when a gunslinger robot goes berserk.",
        },
        {
          tmdbId: 44896,
          title: "Rango",
          year: 2011,
          description:
            "When Rango, a lost family pet, accidentally winds up in the gritty, gun-slinging town of Dirt, the less-than-courageous lizard suddenly finds he stands out. Welcomed as the last hope the town has been waiting for, new Sheriff Rango is forced to play his new role to the hilt.",
        },
      ]);
    });
};
