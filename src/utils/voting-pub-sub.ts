type MessageProps = {
  pollOptionId: string;
  votes: number;
};

type SubscriberProps = (message: MessageProps) => void;

class VotingPubSub {
  private channels: Record<string, SubscriberProps[]> = {};

  subscribe(pollId: string, subscriber: SubscriberProps) {
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }

    this.channels[pollId].push(subscriber);
  }

  publish(pollId: string, message: MessageProps) {
    if (!this.channels[pollId]) return;

    for (const subscriber of this.channels[pollId]) {
      subscriber(message);
    }
  }
}

export const voting = new VotingPubSub();
