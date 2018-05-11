import { IsContributorPipe } from './is-contributor.pipe';

describe('IsContributorPipe', () => {
  it('create an instance', () => {
    const pipe = new IsContributorPipe();
    expect(pipe).toBeTruthy();
  });
});
