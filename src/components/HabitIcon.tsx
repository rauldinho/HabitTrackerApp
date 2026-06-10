import {
  Dumbbell, Bike, Heart, Apple, Droplets, Moon, Sun, BookOpen,
  Music, Pencil, Brain, Coffee, Camera, Code2, Flame, Leaf,
  Star, Trophy, Target, Zap, Clock, Smile, Users, Dog,
  Utensils, Pill, Wind, Footprints, Waves, TreePine, Sunrise,
  Bed, Headphones, Paintbrush, Gamepad2, Newspaper, Sprout,
  Telescope, Swords, GraduationCap, Handshake, Wallet, Recycle,
  PersonStanding, BicepsFlexed,
  Salad, Soup, Sandwich, UtensilsCrossed, Wine,
  Thermometer, Stethoscope, HeartPulse, Baby, Sunset,
  Rainbow, CloudSun, Mountain, Tent, Compass,
  Guitar, Mic2, Piano, Brush, Scissors,
  ShoppingBag, Package, Gift, Sparkles, Gem,
  Book, FileText, PenLine, Lightbulb, FlaskConical,
  Timer, AlarmClock, CalendarCheck, CheckSquare, ListChecks,
  type LucideProps,
} from 'lucide-react'
import type { FC } from 'react'

export const LUCIDE_ICON_MAP: Record<string, FC<LucideProps>> = {
  Dumbbell, Bike, Heart, Apple, Droplets, Moon, Sun, BookOpen,
  Music, Pencil, Brain, Coffee, Camera, Code2, Flame, Leaf,
  Star, Trophy, Target, Zap, Clock, Smile, Users, Dog,
  Utensils, Pill, Wind, Footprints, Waves, TreePine, Sunrise,
  Bed, Headphones, Paintbrush, Gamepad2, Newspaper, Sprout,
  Telescope, Swords, GraduationCap, Handshake, Wallet, Recycle,
  PersonStanding, BicepsFlexed,
  Salad, Soup, Sandwich, UtensilsCrossed, Wine,
  Thermometer, Stethoscope, HeartPulse, Baby, Sunset,
  Rainbow, CloudSun, Mountain, Tent, Compass,
  Guitar, Mic2, Piano, Brush, Scissors,
  ShoppingBag, Package, Gift, Sparkles, Gem,
  Book, FileText, PenLine, Lightbulb, FlaskConical,
  Timer, AlarmClock, CalendarCheck, CheckSquare, ListChecks,
}

// All entries guaranteed to be valid lucide keys — no text fallback rendered
export const HABIT_ICON_LIST = [
  // Fitness & Movement
  { key: 'Dumbbell',       label: 'Weights'       },
  { key: 'BicepsFlexed',   label: 'Strength'      },
  { key: 'Flame',          label: 'Workout'       },
  { key: 'Footprints',     label: 'Walking'       },
  { key: 'Bike',           label: 'Cycling'       },
  { key: 'Waves',          label: 'Swimming'      },
  { key: 'Wind',           label: 'Breathing'     },
  { key: 'PersonStanding', label: 'Stand up'      },
  // Health & Body
  { key: 'Heart',          label: 'Health'        },
  { key: 'HeartPulse',     label: 'Heartbeat'     },
  { key: 'Apple',          label: 'Nutrition'     },
  { key: 'Droplets',       label: 'Hydration'     },
  { key: 'Moon',           label: 'Sleep'         },
  { key: 'Bed',            label: 'Rest'          },
  { key: 'Pill',           label: 'Medication'    },
  { key: 'Thermometer',    label: 'Health check'  },
  { key: 'Stethoscope',    label: 'Medical'       },
  // Food & Drink
  { key: 'Utensils',       label: 'Cooking'       },
  { key: 'Salad',          label: 'Salad'         },
  { key: 'Soup',           label: 'Soup'          },
  { key: 'Sandwich',       label: 'Meal prep'     },
  { key: 'Coffee',         label: 'Coffee'        },
  { key: 'Wine',           label: 'No alcohol'    },
  { key: 'UtensilsCrossed',label: 'No junk food'  },
  // Mind & Learning
  { key: 'Brain',          label: 'Learning'      },
  { key: 'BookOpen',       label: 'Reading'       },
  { key: 'Book',           label: 'Books'         },
  { key: 'GraduationCap',  label: 'Study'         },
  { key: 'Lightbulb',      label: 'Ideas'         },
  { key: 'FlaskConical',   label: 'Science'       },
  { key: 'Telescope',      label: 'Explore'       },
  { key: 'Newspaper',      label: 'News'          },
  // Writing & Creativity
  { key: 'Pencil',         label: 'Writing'       },
  { key: 'PenLine',        label: 'Journaling'    },
  { key: 'FileText',       label: 'Notes'         },
  { key: 'Paintbrush',     label: 'Painting'      },
  { key: 'Brush',          label: 'Art'           },
  { key: 'Scissors',       label: 'Crafts'        },
  { key: 'Camera',         label: 'Photography'   },
  // Tech & Productivity
  { key: 'Code2',          label: 'Coding'        },
  { key: 'ListChecks',     label: 'Tasks'         },
  { key: 'CheckSquare',    label: 'Checklist'     },
  { key: 'CalendarCheck',  label: 'Planning'      },
  { key: 'Timer',          label: 'Timer'         },
  { key: 'AlarmClock',     label: 'Wake up'       },
  { key: 'Clock',          label: 'Time'          },
  // Music & Entertainment
  { key: 'Music',          label: 'Music'         },
  { key: 'Headphones',     label: 'Listen'        },
  { key: 'Guitar',         label: 'Guitar'        },
  { key: 'Piano',          label: 'Piano'         },
  { key: 'Mic2',           label: 'Singing'       },
  { key: 'Gamepad2',       label: 'Gaming'        },
  // Social & Life
  { key: 'Smile',          label: 'Happiness'     },
  { key: 'Users',          label: 'Social'        },
  { key: 'Handshake',      label: 'Connection'    },
  { key: 'Baby',           label: 'Family'        },
  { key: 'Dog',            label: 'Pet'           },
  { key: 'Gift',           label: 'Giving'        },
  { key: 'Sparkles',       label: 'Gratitude'     },
  { key: 'Gem',            label: 'Self-care'     },
  // Nature & Outdoors
  { key: 'Leaf',           label: 'Nature'        },
  { key: 'TreePine',       label: 'Forest'        },
  { key: 'Sprout',         label: 'Growth'        },
  { key: 'Mountain',       label: 'Hiking'        },
  { key: 'Tent',           label: 'Camping'       },
  { key: 'Compass',        label: 'Adventure'     },
  { key: 'Sun',            label: 'Morning'       },
  { key: 'Sunrise',        label: 'Early riser'   },
  { key: 'Sunset',         label: 'Evening'       },
  { key: 'Rainbow',        label: 'Positivity'    },
  { key: 'CloudSun',       label: 'Outside'       },
  // Finance & Goals
  { key: 'Wallet',         label: 'Finance'       },
  { key: 'Target',         label: 'Focus'         },
  { key: 'Trophy',         label: 'Achievement'   },
  { key: 'Star',           label: 'Goal'          },
  { key: 'Zap',            label: 'Energy'        },
  { key: 'Swords',         label: 'Challenge'     },
  { key: 'Recycle',        label: 'Eco'           },
  { key: 'Package',        label: 'Organize'      },
  { key: 'ShoppingBag',    label: 'Shopping'      },
].filter(({ key }) => key in LUCIDE_ICON_MAP) // safety filter — never shows text fallback

interface IconProps {
  name: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function HabitIcon({ name, size = 20, strokeWidth = 2.5, className }: IconProps) {
  const LucideIcon = LUCIDE_ICON_MAP[name]
  if (LucideIcon) {
    return <LucideIcon size={size} strokeWidth={strokeWidth} className={className} />
  }
  // Emoji fallback for legacy data only (won't appear in picker)
  return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{name}</span>
}
