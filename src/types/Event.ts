export type Event = {
  repo: {
    name: string;
  };
  type: string;
  payload: {
    commits: unknown[],
    ref_type: string
  };
  action: string;
}