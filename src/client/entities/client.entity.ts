import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Mood } from 'src/base/mood.embed';
import { Country } from 'src/country/entities/country.entity';
import { RatePlan } from 'src/rate/entities/rate-plan.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Client extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Country, { nullable: false })
  country: Country;

  @OneToOne(() => RatePlan, { nullable: true })
  @JoinColumn()
  ratePlan: RatePlan;

  @Column()
  name: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  streetAddress: string;

  @Column({ nullable: true })
  zipCode: number;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column(() => Mood)
  mood: Mood;
}
