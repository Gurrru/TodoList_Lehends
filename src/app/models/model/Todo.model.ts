export class ToDo {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public done: boolean,
    public createdAt: Date = new Date(), // Creation timestamp defaults to the current date
    public completedAt?: Date // Optional property for completion timestamp
  ) {}
}
