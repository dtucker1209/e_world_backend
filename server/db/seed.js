const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

/* Seeds the database */

async function main() {
  const allUsers = await prisma.User.findMany();
  console.log(allUsers);

  /* creates an item variable and loops through 100 fake rows */

  const item = Array.from({ length: 100 }).map(() => ({
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price:faker.commerce.price({ min: 100, max: 200, dec:2 })
  }))

  /* creates an user variable and loops through 100 fake rows */

  const user = Array.from({ length: 100}).map(() => ({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
  }))
  
  /* invokes the loops */

  await prisma.Item.createMany({data: item});
  await prisma.User.createMany({data: user});
  const Items = await prisma.Item.findMany();
  const Users = await prisma.User.findMany();

  /* creates relational fields for items */
  
// //   Items.forEach(async (Item) => {
//     for (const Item of Items) {
//         // Get the list of real users for review (replace this with actual user fetching logic)
//   const userIds = await prisma.user.findMany({
//     select: { id: true }  // Adjust this to get valid user IDs from your database
//   });
//   for (const user of userIds){
//         // Check if the user has already reviewed the item
//         const existingReview = await prisma.review.findFirst({
//           where: {
//             userId:user.id, // or get this from a real user session
//             itemId: item.id,
//           },
//         });
      
//         if (existingReview) {
//           // If a review already exists, skip creating a new one for this user-item pair
//           console.log(`User ${user.id} has already reviewed item ${Item.id}`);
//           continue;
//         }
//       await prisma.item.update({
//           where: {
//               id: Item.id
//           },
//           data: {
//               review: {
//                   create: {
//                     //   data: Array.from({ length: 4}).map(() => ({
//                           rating: faker.number.int({min: 1, max: 5}),
//                           text: faker.lorem.sentences(),
//                           userId: user.id,
//                         //   userId: faker.number.int({min: 1, max: 100}),
//                     //   }))
//                   }
//               }
//           }
//       });
//       console.log((`Review created for user ${user.id} on item ${item.id}`));
//     }
      
//   };

  
  /* creates relational fields for reviews */

  const Reviews = await prisma.Review.findMany();
  Reviews.forEach(async (Review) => {
      await prisma.Review.update({
          where: {
              id: Review.id
          },
          data: {
              comment: {
                  createMany: {
                      data: Array.from({ length: 4}).map(() => ({
                          text: faker.lorem.sentence(),
                          userId: faker.number.int({min: 1, max: 100}),
                      }))
                  }
              }
          }
      })
  })

    }

console.log('db seeded');


main()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})

module.exports = { main };