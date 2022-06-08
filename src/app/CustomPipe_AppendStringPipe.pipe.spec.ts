import { CustomPipe_AppendStringPipe } from './CustomPipe_AppendStringPipe';

describe('CustomPipe_AppendStringPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomPipe_AppendStringPipe();
    expect(pipe).toBeTruthy();
  });
});
