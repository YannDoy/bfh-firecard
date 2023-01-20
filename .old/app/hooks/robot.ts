import {interpret, Machine, Service} from "robot3";
import {useCallback, useRef, useState} from "react";

export function useMachine<S extends {}, C extends {}>(machine: Machine<S, C>, initialContext: C) {

    // On crée une nouvelle instance de la machine
    const ref = useRef<Service<Machine<S, C>>|null>(null);
    if (ref.current === null) {
        ref.current = interpret(
            machine,
            () => {
                setState(service.machine.current);
                setContext(service.context);
            },
            initialContext
        );
    }
    const service = ref.current;

    // On stocke le context & l'état de la machine dans l'état react
    const [state, setState] = useState(service.machine.current);
    const [context, setContext] = useState(service.context);

    // Permet de demander une transition
    const send = useCallback(
        function (type: string, params = {}) {
            service.send({ type: type, ...params });
        },
        [service]
    );

    // Vérifie si une transition est possible depuis l'état courant
    const can = useCallback(
        (transitionName: string) => {
            const transitions = service.machine.state.value.transitions;
            if (!transitions.has(transitionName)) {
                return false;
            }
            const transitionsForName = transitions.get(transitionName);
            for (const t of transitionsForName ?? []) {
                if ((t.guards && (t.guards as any)(context)) || !t.guards) {
                    return true;
                }
            }
            return false;
        },
        [service.context, service.machine.state.value.transitions]
    );

    return {
        state,
        context,
        send,
        can
    }
}