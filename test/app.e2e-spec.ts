import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { UserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookMarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.cleanDb();
    pactum.request.setBaseUrl('https://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'am@g.com',
      password: '2222',
    };

    describe('signup', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signup').withBody({
          password: dto.password,
        });
      });
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signup').withBody({
          email: dto.email,
        });
      });
      it('should throw if body empty', () => {
        return pactum.spec().post('/auth/signup').withBody({});
      });
      it('can signup', () => {
        return pactum.spec().post('/auth/signup').withBody(dto);
        // .inspect();
        // .expectStatus(201);
      });
    });
    describe('signin', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signin').withBody({
          password: dto.password,
        });
      });
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signin').withBody({
          email: dto.email,
        });
      });
      it('should throw if body empty', () => {
        return pactum.spec().post('/auth/signin').withBody({});
      });
      it('can signin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto);
        // .expectStatus(200);
      });
    });
  });

  describe('User', () => {
    describe('get me', () => {});

    describe('Edit User', () => {
      it('can edit', () => {
        const dto: UserDto = {
          email: 'ali@gmail.com',
          password: '5555',
        };
        return pactum
          .spec()
          .post('/user/edituser')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .withBody(dto);
        // .expectBodyContains(dto.password);
        // .expectStatus(200);
      });
    });
  });

  describe('Bookmark', () => {
    describe('Create Bookmark', () => {
      it('can create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'First Bookmark',
          url: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
        };
        return pactum
          .spec()
          .post('/Bookmark/Create Bookmark')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .withBody(dto)
          .stores('id', 'bookmarkId');
      });
    });
    describe('Get Bookmarks', () => {
      it('get all bookmarks', () => {
        return pactum
          .spec()
          .post('/Bookmark/Get Bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAt}` });
        // .expectBody([]);
      });
    });
    describe('get Bookmark By Id', () => {
      it('get one', () => {
        return pactum
          .spec()
          .post('/Bookmark/{id}')
          .withPathParams('id', '$S{bookmarkid}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' });
      });
    });
    describe('Edit Bookmark', () => {
      const dto: EditBookMarkDto = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto);
        // .expectStatus(200)
        // .expectBodyContains(dto.title)
        // .expectBodyContains(dto.description);
      });
    });
    describe('Delete Bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          });
        // .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum.spec().get('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        });
        // .expectStatus(200)
        // .expectJsonLength(0);
      });
    });
  });
});
